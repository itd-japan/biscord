use axum::{
    extract::{
        ws::{ Message, WebSocket, WebSocketUpgrade },
        State,
    },
    response::IntoResponse,
    routing::get,
    Router,
};

use futures::{
    sink::SinkExt, // データを流し込むための機能
    stream::StreamExt // データが流れてくるのを待つ機能
};

use tokio::net::TcpListener;
use tokio::sync::broadcast;

use std::net::SocketAddr; 
use std::sync::Arc;


// アプリ全体
struct AppState {
    // ブロードキャスト用の送信機
    tx: broadcast::Sender<String>,
}


#[tokio::main]
async fn main() {
    // ブロードキャストのチャンネルを作成
    let (tx, _rx) = broadcast::channel(100);

    let app_state = Arc::new(AppState { tx });

    // ルーティングの設定 "/ws"にアクセスが来たらws_handlerを呼び出す
    // with_stateでハンドラに状態を渡す
    let app = Router::new().route("/ws", get(ws_handler)).with_state(app_state);

    // サーバーの起動設定
    let addr = SocketAddr::from(([127, 0, 0, 1], 5000));
    let listener = TcpListener::bind(addr).await.unwrap();

    // 実行
    axum::serve(listener, app).await.unwrap();
}


// WebSocketハンドラ
async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>, // アプリ状態
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

// 実際の通信処理
async fn handle_socket(socket: WebSocket, state: Arc<AppState>) {
    let (mut sender, mut receiver) = socket.split();

    // 受信機
    let mut rx = state.tx.subscribe();

    // 送信: チャンネルから全体メッセージが来たらクライアントに送る
    // 別のタスクとしてバックグラウンドで動かし続ける
    let send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg.into())).await.is_err() {
                break;
            }
        }
    });

    // 受信: クライアントからメッセージが来たら、チャンネルに流す
    // この関数自体のメインループ
    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(text) = msg {
            let _ = state.tx.send(text.to_string());
        } else if let Message::Close(_) = msg {
            break;
        }
    }

    send_task.abort();
}